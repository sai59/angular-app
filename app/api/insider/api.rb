module Insider
  class API < Grape::API
    version 'v1', using: :header, vendor: 'insider'
    format :json

    helpers do
      def authenticate!
        error!("unauthenticated", 401) unless current_user.present?
      end

      def current_user
        user = User.find_by_access_token(api_token)
        if user.present?
          @current_user = user
        else
          false
        end
      end

      def api_token
        request.env["HTTP_AUTHORIZATION"].gsub(/^Token(.*)=/, '').gsub(/"/, "")
      end
    end

    resource :auth do
      post :login do
        if params[:user]
          user_attributes = params[:user].to_hash
          authorization = Authorization.where(user_attributes).first
          if authorization.present?
            user = User.find(authorization.user_id)
          else
            error!('Profile not linked', 404)
          end
        else
          user = User.where(:email => params[:email], :password => params[:password]).first
        end
        if user.present?
          user.access_token
        else
          error!('not authorized', 401)
        end
      end
    end

    resource :insiders do
      before do
        authenticate!
      end

      get '/todos' do
        Todo.order("todos.created_at DESC")
      end

      get '/todos/:id' do
        Todo.find(params[:id])
      end

      post '/todos/new' do
        todo = Todo.new({:description => params[:description], :title => params[:title], :image_url => params[:image_url]})
        if todo.save
          todo
        end
      end

      get '/facebook_long_lived_token' do
        fb = Social::Facebook::RenewToken.new
        response = fb.get_long_lived_token(current_user, params[:token])
        if response
          response
        end
      end

      get '/save_gplus_user_id' do
        puts params.id.inspect
        params
      end

      post '/save_facebook_graph_object' do
        FacebookGraphObject.new(
          :user_id => current_user.id,
          :todo_id => params[:todo_id],
          :graph_object_id => params[:graph_object_id]
        ).save!
      end

      post '/save_gplus_activity' do
        GplusActivity.save_from_api(current_user.id, params[:todo_id])
      end

      post '/link_profile' do
        user_attributes = params[:user].to_hash
        user_attributes.merge!(:user_id => current_user.id)
        Authorization.where(user_attributes).first_or_create
      end
    end
  end
end
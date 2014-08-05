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
        user = User.where(:email => params[:email], :password => params[:password]).first
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
        todo = Todo.new({:description => params[:description]})
        if todo.save
          todo
        end
      end
    end
  end
end
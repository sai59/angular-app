module Insider
  class API < Grape::API
    version 'v1', using: :header, vendor: 'insider'
    format :json

    resource :insiders do
      get '/todos' do
        Todo.all
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
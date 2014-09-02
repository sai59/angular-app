class TodosController < ApplicationController
  layout false
  def show
    @todo = Todo.find(params[:id])
  end
end
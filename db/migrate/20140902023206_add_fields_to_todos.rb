class AddFieldsToTodos < ActiveRecord::Migration
  def change
    add_column :todos, :title, :text
    add_column :todos, :image_url, :text
  end
end

class CreateFacebookGraphObjects < ActiveRecord::Migration
  def change
    create_table :facebook_graph_objects do |t|
      t.integer :user_id
      t.integer :todo_id
      t.string :graph_object_id
      t.integer :likes
      t.integer :comments
      t.integer :shares
      t.integer :total_points

      t.timestamps
    end
  end
end

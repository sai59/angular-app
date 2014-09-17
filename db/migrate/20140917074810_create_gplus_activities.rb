class CreateGplusActivities < ActiveRecord::Migration
  def change
    create_table :gplus_activities do |t|
      t.integer :user_id
      t.integer :todo_id
      t.string :gplus_activity_id
      t.integer :plus_ones
      t.integer :comments
      t.integer :shares
      t.integer :total_points

      t.timestamps
    end
  end
end

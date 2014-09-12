class FacebookGraphObject < ActiveRecord::Base
  attr_accessible :comments, :graph_object_id, :likes, :shares, :todo_id, :total_points, :user_id
end

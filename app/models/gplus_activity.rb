class GplusActivity < ActiveRecord::Base
  attr_accessible :comments, :gplus_activity_id, :plus_ones, :shares, :todo_id, :total_points, :user_id

  def self.save_from_api(user_id, todo_id)
    Delayed::Job.enqueue(
      StoreGplusActivityJob.new(user_id, :todo_id)
    )
    true
  end
end

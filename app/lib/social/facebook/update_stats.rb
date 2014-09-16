class Social::Facebook::UpdateStats
  
  def self.perform_daily_update
    update_process = new
    update_process.perform_daily_update
  end
  
  def perform_daily_update
    users.each do |user|
      api = Koala::Facebook::API.new(user.fb_long_lived_token)
      user.facebook_graph_objects.each do |go|
        response = api.get_object(go.graph_object_id)
        attrs = {
          :likes => response["likes"]["count"],
          :comments => response["comments"]["count"]
        }
        go.update_attributes(attrs)
      end
    end
  end

  def users
    User.all
  end
end
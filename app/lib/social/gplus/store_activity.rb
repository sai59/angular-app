class Social::Gplus::StoreActivity
  attr_reader :user_id, :todo_id

  def self.store(user_id, todo_id)
    api = new(user_id, todo_id)
    api.setup_service
    api.store_activity
  end

  def initialize(user_id, todo_id)
    @user_id = user_id
    @todo_id = todo_id
  end

  def store_activity
    person = GooglePlus::Person.get(gplus_user_id)
    cursor = person.list_activities(:max_results => 10)
    cursor.each do |activity|
      gplus_object = activity.object
      if gplus_object.object_type == "note"
        if our_activity?(gplus_object)
          save_to_db(activity)
        end
      end
    end
  end

  def our_activity?(activity)
    if activity.respond_to?(:attachments) && activity.attachments.present?
      activity.attachments[0]["url"].include?(Settings.app.url)
    else
      false
    end
  end

  def save_to_db(activity)
    gplus_act = GplusActivity.find_or_create_by_gplus_activity_id(activity.id)
    activity_stat = activity.object
    gplus_act.update_attributes({
      :user_id => user_id,
      :todo_id => todo_id,
      :comments => activity_stat.replies.total_items,
      :plus_ones => activity_stat.plusoners.total_items,
      :shares => activity_stat.resharers.total_items
    })
  end
  
  def gplus_user_id
    "117780785278803383324"# TODO: uncomment the following code when the Authorization is in place
    # user = Authorization.where(:user_id => user_id, :provider => 'gplus').first
    # if user.present?
      # gplus_user_id = user.uid
    # end
    # gplus_user_id || user_id # default to normal user id, but it should not in production
  end

  def setup_service
    GooglePlus.api_key = Settings.gplus.api_key
  end
end
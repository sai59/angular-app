class GooglePlusApiService

  def initialize
    GooglePlus.api_key = 'AIzaSyCRe93tHikrttW3P0Wv58jvqhhhFghQiKk'
  end

  def find_activity(user_id)
    person = GooglePlus::Person.get(user_id)
    cursor = person.list_activities(:max_results => 2)
    cursor.each do |item|
      # puts item.id
      gplus_object = item.object
      if gplus_object.object_type == "note"
        # check app url name and app title
        if !gplus_object.attachments.empty? && gplus_object.attachments[0]["displayName"] == "AngularApp" && gplus_object.attachments[0]["url"].include?("todo-social.herokuapp.com")
          puts gplus_object.content
          puts gplus_object.replies.total_items
          puts gplus_object.plusoners.total_items
          puts gplus_object.resharers.total_items
        end
      end
    end
  end

end
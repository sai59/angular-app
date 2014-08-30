class Facebook
  include HTTParty
  base_uri 'https://graph.facebook.com'

  def initialize
    @options = {
      client_id: Settings.facebook.app_id,
      client_secret: Settings.facebook.app_secret,
      grant_type: 'fb_exchange_token'
    }
  end

  def long_lived_access_token(current_user, token)
    # @options.merge!({:fb_exchange_token => token})
    # self.class.get("/oauth/access_token", @options)
    response = HTTParty.get("https://graph.facebook.com/oauth/access_token?client_id=#{Settings.facebook.app_id}&client_secret=#{Settings.facebook.app_secret}&grant_type=fb_exchange_token&fb_exchange_token=#{token}")
    if response.code == 200
      current_user.update_attribute(:fb_long_lived_token, response.parsed_response.split('&')[0].split('=')[1])
      response
    else
      response
    end
  end

end
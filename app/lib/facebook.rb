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

  def long_lived_access_token(token)
    @options.merge!({:fb_exchange_token => token})
    self.class.get("/oauth/access_token", @options)
  end

end
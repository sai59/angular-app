class Social::Facebook::RenewToken
  include HTTParty
  base_uri 'https://graph.facebook.com'
  
  def initialize
    @options = {
      :client_id =>  Settings.facebook.app_id,
      :client_secret => Settings.facebook.app_secret,
      :grant_type => 'fb_exchange_token'
    }
  end

  def get_long_lived_token(current_user, short_lived_token)
    @options.merge!({:fb_exchange_token => short_lived_token})

    response = self.class.get('/oauth/access_token', @options)
    if response.code == 200
      access_token = extract_access_token(response)
      current_user.update_attribute(:fb_long_lived_token, access_token)
    else
      # notify error
    end
  end

  private

  def extract_access_token(response)
    result = Rack::Utils.parse_nested_query(response.parsed_response)
    result["access_token"]
  end
end
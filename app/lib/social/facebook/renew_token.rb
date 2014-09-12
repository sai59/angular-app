class Social::Facebook::RenewToken
  include HTTParty
  base_uri 'https://graph.facebook.com'
  
  def initialize
    @options = {
      :client_id =>  Settings.facebook.app_id,
      :client_secret => Settings.facebook.app_secret,
      :grant_type => 'fb_exchange_token',
      :redirect_uri => Settings.facebook.redirect_uri
    }
  end

  def get_long_lived_token(current_user, short_lived_token)
    # Step1: get online long lived token
    long_lived_options = @options.merge({:fb_exchange_token => short_lived_token})
    response_one = self.class.get('/oauth/access_token', :query => long_lived_options)

    if response_one.code == 200
      access_token = extract_access_token(response_one)

      # Step2: get code
      code_opt = @options.merge({:access_token => access_token})
      code_res = self.class.get('/oauth/client_code', :query => code_opt)
      code = code_res["code"]

      # Setp3: get offline access token
      offline_opt = @options.merge(:code => code)
      offline_res = self.class.get('/oauth/access_token', :query => offline_opt)
      offline_access_token = offline_res["access_token"]

      current_user.update_attribute(:fb_long_lived_token, offline_access_token)
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
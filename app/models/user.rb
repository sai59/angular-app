class User < ActiveRecord::Base
  attr_accessible :access_token, :email, :first_name, :last_name, :password
end

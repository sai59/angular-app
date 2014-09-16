class User < ActiveRecord::Base
  attr_accessible :access_token, :email, :first_name, :last_name, :password

  has_many :facebook_graph_objects
end

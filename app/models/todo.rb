class Todo < ActiveRecord::Base
  attr_accessible :description, :title, :image_url
end

class AddFaceBookLongLivedTokenToUsers < ActiveRecord::Migration
  def change
    add_column :users, :fb_long_lived_token, :text
  end
end

class CreateAuthorizations < ActiveRecord::Migration
  def change
    create_table :authorizations do |t|
      t.string :uid
      t.integer :user_id
      t.string :provider

      t.timestamps
    end
  end
end

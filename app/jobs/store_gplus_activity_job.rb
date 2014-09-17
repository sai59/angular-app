StoreGplusActivityJob = Struct.new(:user_id, :todo_id) do
  def enqueue(job)
    # Your job is enqueued
  end
  
  def perform
    Social::Gplus::StoreActivity.store(user_id, todo_id)
  end
  
  # overwrite max attempts
  def max_attempts
    return 3
  end
  
  def before(job)
    # Just before running the job
  end

  def after(job)
    # What should i do after running?
  end
end
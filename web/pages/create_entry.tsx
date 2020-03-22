const CreateEntry = () => {
  return (
    <div>
      <label htmlFor="title">title</label>
      <input id="title" name="title" />
      <label htmlFor="body">body</label>
      <input id="body" name="body" />
      <label htmlFor="tags">tags</label>
      <select id="tags">
        <option>test</option>
      </select>
      <div>
        <button>submit</button>
      </div>
      <div>
        <button>cancel</button>
      </div>
    </div>
  );
};

export default CreateEntry;

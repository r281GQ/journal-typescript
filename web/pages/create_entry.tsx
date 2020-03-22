const CreateEntry = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column"
      }}
    >
      <form
        onSubmit={e => {
          e.preventDefault();
        }}
      >
        <div
          style={{
            margin: "12px 0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          <label style={{ display: "block" }} htmlFor="title">
            title
          </label>
          <input id="title" name="title" />
        </div>
        <div
          style={{
            margin: "12px 0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          <label htmlFor="body">body</label>
          <textarea id="body" name="body" />
        </div>
        <div
          style={{
            margin: "12px 0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          <label htmlFor="tags">tags</label>
          <select id="tags">
            <option>test</option>
          </select>
        </div>
        <div
          style={{
            margin: "12px 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <div style={{ margin: "0 4px" }}>
            <button type="submit">submit</button>
          </div>
          <div style={{ margin: "0 4px" }}>
            <button>cancel</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateEntry;

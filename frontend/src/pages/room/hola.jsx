export default function Owo() {
  return (
    <div
      className="Room"
      style={{
        display: "",
        textAlign: "center",
        alignContent: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{ display: "block", backgroundColor: "red", width: "100%" }}
        onSubmit={handleSendMessage}
      >
        <input
          type="text"
          name="message"
          id="message"
          placeholder="Escribe un mensaje aqui"
          onChange={(e) => setTemporalMessage(e.target.value)}
        />
        <button
          onClick={() => {
            handleSendMessage();
          }}
        >
          Enviar
        </button>
      </div>
      <div
        className="messageList"
        id="ewe"
        style={{ backgroundColor: "black" }}
      >
        {renderMessages()}
      </div>
    </div>
  );
}

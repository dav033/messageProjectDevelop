import "./listComponent.scss";

export default function ListComponent(props) {
  const { onClickFunction, text, optionalContent } = props;
  return (
    <div className="component" onClick={onClickFunction}>
      <div className="" id="titulo">
        <h1 style={{ textOverflow: "" }}>{text}</h1>
      </div>
      {optionalContent}
    </div>
  );
}

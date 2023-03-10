import "./Spinner.css";

// Component from https://loading.io/css/
function Spinner() {
  return (
    <div className="lds-ring">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}

export default Spinner;

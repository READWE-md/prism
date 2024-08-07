import { useNavigate } from "react-router-dom";

const CheckList = () => {
  const navigate = useNavigate();
  return (
    <div>
      <h1>checklist</h1>
      <button
        onClick={() => {
          navigate(-1);
        }}
      >
        back
      </button>
    </div>
  );
};

export default CheckList;

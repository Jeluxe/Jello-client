import { PlusIcon } from "../../../assets/icons";
import { ProjectProviderOperations, useProjectProvider } from "../../../context/ProjectContext";
import { useInput } from "../../../hooks/useInput";
import Button from "../../Button/Button";
import Input from "../../Input/Input";
import "./NewCardForm.css";

type NewCardProps = { setIsOpen: React.Dispatch<boolean>, containerId: string }

const NewCard = ({ setIsOpen, containerId }: NewCardProps) => {
  const { addCard }: Pick<ProjectProviderOperations, "addCard"> = useProjectProvider()
  const { value, error, handleChange, onAction, onKeyDown } = useInput((name) => addCard(containerId, name), setIsOpen)


  return (
    <div className="card new-card">
      <Input className={"card-input"} type="text" value={value} onChange={handleChange} onKeyDown={onKeyDown} maxLength={24} />
      {error.error && <span className='error-message'>{error.message}</span>}
      <Button title={<PlusIcon />} onClick={onAction}></Button>
    </div>
  )
};

export default NewCard;
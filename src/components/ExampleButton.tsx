import { btn } from "./styles";

interface Props {
  label: string;
  onClick: () => void;
}

// Loads a sample program into the editor. It does not run the lexer.
export default function ExampleButton({ label, onClick }: Props) {
  return (
    <button type="button" className={btn} onClick={onClick}>
      {label}
    </button>
  );
}

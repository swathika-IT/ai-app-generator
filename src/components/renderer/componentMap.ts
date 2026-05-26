import { InputField } from "./components/InputField";
import { TextareaField } from "./components/TextareaField";
import { SelectField } from "./components/SelectField";
import { DynamicButton } from "./components/DynamicButton";
import { DashboardCard } from "./components/DashboardCard";
import { DynamicTable } from "./components/DynamicTable";
import { SectionWrapper } from "./components/SectionWrapper";
import { HeadingComponent } from "./components/HeadingComponent";

export const componentMap: Record<string, React.ComponentType<any>> = {
  input: InputField,
  textarea: TextareaField,
  select: SelectField,
  button: DynamicButton,
  card: DashboardCard,
  table: DynamicTable,
  section: SectionWrapper,
  heading: HeadingComponent,
};

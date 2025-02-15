import { fireEvent, render } from "@testing-library/react";
import Settings, {
  FormContainer,
  Table,
  TableRow,
  TableCell,
  HeadCell,
  Section,
  SectionHeadline,
} from "../../components/settings";
import { IThemeProps } from "../../lib/useTheme";

const themes: Array<IThemeProps> = [
  {
    label: "Classic",
    value: 0,
    mainColor: "#000000",
    accentColor: "#1e272e",
    backgroundColor: "#ffffff",
  },
  {
    label: "Classic",
    value: 1,
    mainColor: "#000000",
    accentColor: "#1e272e",
    backgroundColor: "#ffffff",
  },
];
const propsList = [
  {
    themes: themes
  },
  {
    themes: undefined  }
];

describe("settings.tsx", () => {
  const location: Location = window.location;

  beforeEach(() => {
    // @ts-ignore
    delete window.location;

    window.location = {
      ...location,
      reload: jest.fn(),
    };
  });

  it("Tests forms", () => {
    const { asFragment } = render(<FormContainer />);
    expect(asFragment).toMatchSnapshot();
  });

  it("Tests tables", () => {
    const { asFragment } = render(
      <Table>
        <tbody>
          <TableRow>
            <HeadCell>Test</HeadCell>
          </TableRow>
          <TableRow>
            <TableCell>Test</TableCell>
          </TableRow>
        </tbody>
      </Table>,
    );

    expect(asFragment).toMatchSnapshot();
  });

  it("Tests sections", () => {
    const { asFragment } = render(
      <Section>
        <SectionHeadline>Test</SectionHeadline>
      </Section>,
    );

    expect(asFragment).toMatchSnapshot();
  });

  it("Tests settings rendering", () => {
    propsList.forEach((props) => {
      const { asFragment } = render(
        <Settings themes={props.themes} />,
      );

      expect(asFragment).toMatchSnapshot();
    });
  });

  it("Tests submit button", () => {
    const settings = render(<Settings themes={themes} />);

    fireEvent.click(settings.getByTestId("button-refresh"));
    expect(window.location.reload).toHaveBeenCalledTimes(1);
  });

  it("Tests light theme selection", () => {
    const settings = render(<Settings themes={themes} />);

    fireEvent.change(settings.getByTestId("select-light"), {
      target: { value: 0 },
    });

    fireEvent.click(settings.getByTestId("button-submit"));
    expect(window.location.reload).toHaveBeenCalledTimes(1);
  });

  it("Tests dark theme selection", () => {
    const settings = render(<Settings themes={themes} />);

    fireEvent.change(settings.getByTestId("select-dark"), {
      target: { value: 0 },
    });

    fireEvent.click(settings.getByTestId("button-submit"));
    expect(window.location.reload).toHaveBeenCalledTimes(1);
  });

  it("Tests theme selection", () => {
    const settings = render(<Settings themes={themes} />);

    fireEvent.change(settings.getByTestId("select-light"), {
      target: { value: 5 },
    });

    fireEvent.click(settings.getByTestId("button-submit"));
    expect(window.location.reload).toHaveBeenCalledTimes(0);
  });
});

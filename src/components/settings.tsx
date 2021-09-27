import { useState } from "react";
import styled from "styled-components";

import Select from "./select";

import { setTheme, IThemeProps, getTheme } from "../lib/useTheme";
import { Button, SubHeadline } from "./elements";

import Modal from "./modal";

export const FormContainer = styled.div`
  margin-bottom: 1em;
`;

export const Table = styled.table`
  font-weight: 400;
  background: none;
  width: 100%;
  color: ${(props) => props.theme.mainColor};
`;

export const TableRow = styled.tr`
  border-bottom: 1px solid ${(props) => props.theme.mainColor};
`;

export const TableCell = styled.td`
  background: none;
  padding-top: 0.5rem;
`;

export const HeadCell = styled.th`
  font-weight: 700;
  text-align: left;
`;

export const Section = styled.div`
  padding: 1rem 0;
`;

export const SectionHeadline = styled(SubHeadline)`
  width: 100%;
  border-bottom: 1px solid ${(props) => props.theme.accentColor};
  margin-bottom: 0.5rem;
`;
const ThemeHeader = styled.p`
  grid-column: 1 / 4;
  color: ${(props) => props.theme.accentColor};
`;

const ThemeSelect = styled(Select)`
  -webkit-appearance: button;
  -moz-appearance: button;

  text-transform: uppercase;
  font-family: Roboto, sans-serif;
  font-weight: 400;
  border: 1px solid ${(props) => props.theme.mainColor};
  color: ${(props) => props.theme.mainColor};
  background: none;

  & > option {
    background-color: ${(props) => props.theme.backgroundColor};
  }
`;

interface ISettingsProps {
  themes: Array<IThemeProps> | undefined;
}

/**
 * Handles the settings-modal
 * @param {Array<IThemeProps>} themes - the list of themes a user can select between
 * @param {ISearchProps} search - the list of search providers
 */
  const Settings = ({ themes}: ISettingsProps) => {
  const [newLightTheme, setNewLightTheme] = useState<IThemeProps>();
  const [newDarkTheme, setNewDarkTheme] = useState<IThemeProps>();

  const currentLightTheme = getTheme("light").label;
  const currentDarkTheme = getTheme("dark").label;

  if (themes) {
    return (
      <Modal element="icon" icon="settings" title="Settings">
        {themes && (
          <Section>
            <SectionHeadline>Theme:</SectionHeadline>
            <FormContainer>
              <ThemeHeader>Light</ThemeHeader>
              <ThemeSelect
                items={themes}
                onChange={(theme: IThemeProps) => setNewLightTheme(theme)}
                current={currentLightTheme}
                testId="light"
              ></ThemeSelect>
              <ThemeHeader>Dark</ThemeHeader>
              <ThemeSelect
                items={themes}
                onChange={(theme: IThemeProps) => setNewDarkTheme(theme)}
                current={currentDarkTheme}
                testId="dark"
              ></ThemeSelect>
            </FormContainer>
            <Button
              data-testid="button-submit"
              onClick={() => {
                if (newLightTheme) setTheme("light", newLightTheme);
                if (newDarkTheme) setTheme("dark", newDarkTheme);
              }}
            >
              Apply
            </Button>
            <Button
              data-testid="button-refresh"
              onClick={() => window.location.reload()}
            >
              Refresh
            </Button>
          </Section>
        )}
      </Modal>
    );
  } else {
    return <></>;
  }
};

export default Settings;

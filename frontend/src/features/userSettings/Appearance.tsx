import { Card, Radio, Typography } from "antd";
import { useTheme } from "next-themes";

export default function Appearance() {
  const { theme, setTheme } = useTheme();

  return (
    <Card title="Appearance" variant="outlined">
      <Typography.Text>Theme</Typography.Text>
      <Radio.Group
        onChange={(e) => setTheme(e.target.value)}
        value={theme}
        style={{ marginTop: 16 }}
      >
        <Radio value="system">System</Radio>
        <Radio value="light">Light Mode</Radio>
        <Radio value="dark">Dark Mode</Radio>
      </Radio.Group>
    </Card>
  );
}

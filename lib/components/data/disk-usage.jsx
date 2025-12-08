import * as Uebersicht from "uebersicht";
import * as DataWidget from "./data-widget.jsx";
import useWidgetRefresh from "../../hooks/use-widget-refresh";
import useServerSocket from "../../hooks/use-server-socket";
import { useSimpleBarContext } from "../simple-bar-context.jsx";
import * as Utils from "../../utils";

export { diskUsageStyles as styles } from "../../styles/components/data/disk-usage";

const { React } = Uebersicht;

const DEFAULT_REFRESH_FREQUENCY = 30000;
const LOW_DISK_THRESHOLD = 20; // GB

/**
 * Disk Usage Widget component
 * Displays remaining disk space for the root partition (/)
 * @returns {JSX.Element|null} The disk usage widget
 */
export const Widget = React.memo(() => {
  const { displayIndex, settings } = useSimpleBarContext();
  const { widgets, diskUsageWidgetOptions } = settings;
  const { diskUsageWidget } = widgets;
  const { refreshFrequency, showOnDisplay } = diskUsageWidgetOptions;

  // Determine if the widget should be visible based on display settings
  const visible =
    Utils.isVisibleOnDisplay(displayIndex, showOnDisplay) && diskUsageWidget;

  // Calculate the refresh frequency for the widget
  const refresh = React.useMemo(
    () =>
      Utils.getRefreshFrequency(refreshFrequency, DEFAULT_REFRESH_FREQUENCY),
    [refreshFrequency],
  );

  const [availableGB, setAvailableGB] = React.useState("--");

  /**
   * Reset the widget state
   */
  const resetWidget = () => {
    setAvailableGB("--");
  };

  /**
   * Fetch disk usage information for root partition
   */
  const getDiskUsage = React.useCallback(async () => {
    if (!visible) return;
    try {
      // Get available space for root partition using df -h (human readable)
      const output = await Uebersicht.run(
        `df -h / | tail -1 | awk '{print $4}'`,
      );
      const availableStr = output.trim();
      
      // Parse the human readable format (e.g., "68G", "1.5T", "512M")
      const match = availableStr.match(/^([\d.]+)([KMGT]?)$/);
      if (!match) {
        setAvailableGB("--");
        return;
      }

      const value = parseFloat(match[1]);
      const unit = match[2] || "G";

      let availableGB = value;
      switch (unit) {
        case "K":
          availableGB = value / (1024 ** 2);
          break;
        case "M":
          availableGB = value / 1024;
          break;
        case "G":
          availableGB = value;
          break;
        case "T":
          availableGB = value * 1024;
          break;
        default:
          availableGB = value;
      }

      setAvailableGB(parseFloat(availableGB.toFixed(1)));
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("Error fetching disk usage:", e);
      setAvailableGB("--");
    }
  }, [visible]);

  // Use server socket to fetch disk usage data
  useServerSocket("disk-usage", visible, getDiskUsage, resetWidget);
  // Refresh the widget at the specified interval
  useWidgetRefresh(visible, getDiskUsage, refresh);

  if (!visible) return null;

  const isLowDisk = availableGB < LOW_DISK_THRESHOLD;

  const classes = Utils.classNames("disk-usage", {
    "disk-usage--critical": isLowDisk,
  });

  return (
    <DataWidget.Widget
      classes={classes}
      disableSlider
    >
      <span className="disk-usage__text">
        {availableGB}GB
      </span>
    </DataWidget.Widget>
  );
});

Widget.displayName = "DiskUsage";

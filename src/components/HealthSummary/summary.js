import React from "react";
import PropTypes from "prop-types";
import { Icon } from "../Icon";
import { Chip } from "../Chip";

function getChipsFromSummary(summary) {
  const chips = [];
  if (summary.healthy > 0) {
    chips.push(<Chip text={summary.healthy} label="Healthy" color="green" />);
  }
  if (summary.unhealthy > 0) {
    chips.push(<Chip text={summary.unhealthy} label="Unhealthy" color="red" />);
  }
  if (summary.warning > 0) {
    chips.push(<Chip text={summary.warning} label="Warning" color="orange" />);
  }
  if (summary.unknown > 0) {
    chips.push(<Chip text={summary.unknown} label="Unknown" color="gray" />);
  }
  return chips;
}

export const HealthSummary = ({ component, iconSize }) => {
  const { name, icon, summary } = component;
  return (
    <div>
      <div className="flex mb-1.5">
        <Icon name={icon} className="mr-2" size={iconSize} />
        <h5 className="text-xs linear-1.21rel">{name}</h5>
      </div>
      <div className="grid gap-2 grid-cols-node-stats">
        {getChipsFromSummary(summary)}
      </div>
    </div>
  );
};

HealthSummary.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  iconSize: PropTypes.string,
  summary: PropTypes.arrayOf(PropTypes.shape({})).isRequired
};

HealthSummary.defaultProps = {
  iconSize: "sm"
};

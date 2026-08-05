import React from "react";
import { Tag } from "antd";
import "./AdminPageHero.css";

function AdminPageHero({
  eyebrow = "DRIVEEASE ADMIN",
  title,
  description,
  icon,
  actions = null,
  stats = [],
  theme = "blue",
}) {
  return (
    <section
      className={`admin-page-hero admin-page-hero-${theme}`}
    >
      <div className="admin-page-hero-decoration admin-page-hero-decoration-one" />
      <div className="admin-page-hero-decoration admin-page-hero-decoration-two" />

      <div className="admin-page-hero-content">
        <div className="admin-page-hero-main">
          <div className="admin-page-hero-icon">
            {icon}
          </div>

          <div className="admin-page-hero-text">
            <span className="admin-page-hero-eyebrow">
              {eyebrow}
            </span>

            <h1>{title}</h1>

            <p>{description}</p>
          </div>
        </div>

        {actions && (
          <div className="admin-page-hero-actions">
            {actions}
          </div>
        )}
      </div>

      {stats.length > 0 && (
        <div className="admin-page-hero-stats">
          {stats.map((stat) => (
            <div
              className="admin-page-hero-stat"
              key={stat.label}
            >
              <div className="admin-page-hero-stat-icon">
                {stat.icon}
              </div>

              <div>
                <span>{stat.label}</span>

                <strong>
                  {stat.prefix || ""}
                  {stat.value ?? 0}
                  {stat.suffix || ""}
                </strong>
              </div>

              {stat.status && (
                <Tag color={stat.color || "blue"}>
                  {stat.status}
                </Tag>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default AdminPageHero;
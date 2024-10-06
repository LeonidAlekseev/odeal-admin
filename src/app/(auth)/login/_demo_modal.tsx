"use client";

import React, { useState } from "react";
import { Card, Space, Button, Modal, Typography } from "antd";

export const DemoModal: React.FC = () => {
  // TODO
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        type="primary"
        onClick={() => setIsModalOpen(true)}
        style={{
          zIndex: "999",
          position: "absolute",
          top: "12px",
          left: "12px",
        }}
      >
        Демо аккаунты
      </Button>
      <Modal
        title="Демо аккаунты"
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        style={{
          overflow: "hidden",
        }}
      >
        <Space
          direction="vertical"
          size={16}
          style={{
            display: "grid",
            width: "100%",
            gap: "12px",
            gridTemplateColumns: "1fr 1fr",
          }}
        >
          <Card size="small" title="Админ">
            <Typography.Paragraph>Логин и Пароль:</Typography.Paragraph>
            <Typography.Paragraph copyable style={{ marginBottom: 0 }}>
              admindemo@demo.demo
            </Typography.Paragraph>
            <Typography.Paragraph
              copyable={{ tooltips: false }}
              style={{ marginBottom: 0 }}
            >
              admindemo
            </Typography.Paragraph>
          </Card>
          <Card size="small" title="Агент">
            <Typography.Paragraph>Логин и Пароль:</Typography.Paragraph>
            <Typography.Paragraph
              copyable={{ tooltips: false }}
              style={{ marginBottom: 0 }}
            >
              agentdemo@demo.demo
            </Typography.Paragraph>
            <Typography.Paragraph
              copyable={{ tooltips: false }}
              style={{ marginBottom: 0 }}
            >
              agentdemo
            </Typography.Paragraph>
          </Card>
          <Card
            size="small"
            title="Разработчик"
            extra={
              <a href="https://cms.simplizio.com/" target="_blank">
                Открыть
              </a>
            }
          >
            <Typography.Paragraph>Логин и Пароль:</Typography.Paragraph>
            <Typography.Paragraph
              copyable={{ tooltips: false }}
              style={{ marginBottom: 0 }}
            >
              leonidalekseevv@mail.ru
            </Typography.Paragraph>
            <Typography.Paragraph
              copyable={{ tooltips: false }}
              style={{ marginBottom: 0 }}
            >
              Devdemo1
            </Typography.Paragraph>
          </Card>
        </Space>
      </Modal>
    </>
  );
};

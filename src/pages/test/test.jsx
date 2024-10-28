// import React, { useState } from "react";
// import { Form, Input, Button, Upload, message } from "antd";
// import { UploadOutlined } from "@ant-design/icons";
// import axios from "axios";

// const CertificateForm = () => {
//   const [form] = Form.useForm();
//   const [fileList, setFileList] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Hàm xử lý khi upload file
//   const handleUploadChange = ({ fileList }) => {
//     setFileList(fileList);
//   };

//   // Hàm xử lý submit form
//   const onFinish = async (values) => {
//     setLoading(true);
//     try {
//       // Tạo đối tượng formData để gửi file và dữ liệu
//       const formData = new FormData();
//       formData.append("certificateName", values.certificateName);
//       formData.append("certificateDescription", values.certificateDescription);
//       formData.append("orderId", values.orderId);
//       formData.append("health", values.health);
//       formData.append("origin", values.origin);
//       formData.append("award", values.award);

//       // Thêm ảnh vào formData
//       if (fileList.length > 0) {
//         formData.append("image", fileList[0].originFileObj);
//       }

//       // Gửi yêu cầu POST tới API
//       const response = await axios.post(
//         "/api/v1/certificates/create",
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       if (response.data.code === 0) {
//         message.success("Certificate created successfully!");
//         form.resetFields();
//         setFileList([]);
//       } else {
//         message.error(`Error: ${response.data.message}`);
//       }
//     } catch (error) {
//       message.error("Failed to create certificate. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Form
//       form={form}
//       name="certificateForm"
//       layout="vertical"
//       onFinish={onFinish}
//     >
//       <Form.Item
//         name="certificateName"
//         label="Certificate Name"
//         rules={[{ required: true, message: "Please enter certificate name!" }]}
//       >
//         <Input placeholder="Enter certificate name" />
//       </Form.Item>

//       <Form.Item
//         name="certificateDescription"
//         label="Certificate Description"
//         rules={[
//           { required: true, message: "Please enter certificate description!" },
//         ]}
//       >
//         <Input.TextArea placeholder="Enter certificate description" />
//       </Form.Item>

//       <Form.Item
//         name="orderId"
//         label="Order ID"
//         rules={[{ required: true, message: "Please enter order ID!" }]}
//       >
//         <Input placeholder="Enter order ID" />
//       </Form.Item>

//       <Form.Item
//         name="health"
//         label="Health Status"
//         rules={[{ required: true, message: "Please enter health status!" }]}
//       >
//         <Input placeholder="Enter health status" />
//       </Form.Item>

//       <Form.Item
//         name="origin"
//         label="Origin"
//         rules={[{ required: true, message: "Please enter origin!" }]}
//       >
//         <Input placeholder="Enter origin" />
//       </Form.Item>

//       <Form.Item name="award" label="Award">
//         <Input placeholder="Enter award (optional)" />
//       </Form.Item>

//       <Form.Item
//         label="Upload Image"
//         rules={[{ required: true, message: "Please upload an image!" }]}
//       >
//         <Upload
//           listType="picture"
//           fileList={fileList}
//           beforeUpload={() => false} // Không tự động upload
//           onChange={handleUploadChange}
//         >
//           <Button icon={<UploadOutlined />}>Click to Upload</Button>
//         </Upload>
//       </Form.Item>

//       <Form.Item>
//         <Button type="primary" htmlType="submit" loading={loading}>
//           Submit
//         </Button>
//       </Form.Item>
//     </Form>
//   );
// };

// export default CertificateForm;

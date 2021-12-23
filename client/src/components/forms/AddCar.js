import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Form, Input, Button, Select } from "antd";
import { v4 as uuidv4 } from "uuid";
import { GET_PEOPLE, ADD_CAR, GET_CARS } from "../../queries";

const { Option } = Select;

const AddCar = () => {
  const [id] = useState(uuidv4());
  const [personId, setPersonId] = useState();
  const [form] = Form.useForm();
  const [, forceUpdate] = useState();
  const [addCar] = useMutation(ADD_CAR);

  useEffect(() => {
    forceUpdate({});
  }, []);

  const onFinish = (values) => {
    const { year, make, model, price } = values;

    addCar({
      variables: {
        id,
        year,
        make,
        model,
        price,
        personId,
      },
      optimisticResponse: {
        __typename: "Mutation",
        addCar: {
          __typename: "Car",
          id,
          year,
          make,
          model,
          price,
          personId,
        },
      },
      update: (proxy, { data: { addCar } }) => {
        const data = proxy.readQuery({ query: GET_CARS });
        proxy.writeQuery({
          query: GET_CARS,
          data: {
            ...data,
            cars: [...data.cars, addCar],
          },
        });
      },
    });
  };

  const onChange = (value) => {
    setPersonId(value);
  };

  const { loading, error, data: data1 } = useQuery(GET_PEOPLE);
  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;

  return (
    <Form
      form={form}
      name="add-car-form"
      layout="inline"
      size="large"
      onFinish={onFinish}
      style={{ marginBottom: "40px", gap: "8px" }}
    >
      <Form.Item
        name="year"
        rules={[{ required: true, message: "Enter the vehicle's year" }]}
      >
        <Input type="number" placeholder="Year (eg: 1996)" />
      </Form.Item>
      <Form.Item
        name="make"
        rules={[{ required: true, message: "Enter the vehicle's make" }]}
      >
        <Input placeholder="Make (eg: Tesla)" />
      </Form.Item>
      <Form.Item
        name="model"
        rules={[{ required: true, message: "Enter the vehicle's model" }]}
      >
        <Input placeholder="Model (eg: Roadster)" />
      </Form.Item>
      <Form.Item
        name="price"
        rules={[{ required: true, message: "Enter the vehicle's price" }]}
      >
        <Input type="number" placeholder="Price (eg: 250000)" />
      </Form.Item>
      <Form.Item
        name="personId"
        rules={[{ required: true, message: "Select the vehicle's owner" }]}
      >
        <Select
          showSearch
          style={{ width: 200 }}
          placeholder="Select a person"
          optionFilterProp="children"
          onChange={onChange}
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {data1.people.map(({ id, firstName, lastName }) => (
            <Option key={id} value={id}>
              {firstName} {lastName}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item shouldUpdate={true}>
        {() => (
          <Button
            type="primary"
            htmlType="submit"
            disabled={
              !form.isFieldsTouched(true) ||
              form.getFieldsError().filter(({ errors }) => errors.length).length
            }
          >
            Add Car
          </Button>
        )}
      </Form.Item>
    </Form>
  );
};

export default AddCar;

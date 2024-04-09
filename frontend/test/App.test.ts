import { mount } from "@vue/test-utils";
import App from "../src/App.vue";

test("Should create a passenger account", async () => {
  const wrapper = mount(App, {});
  expect(wrapper.get(".step").text()).toBe("Step 1");
  expect(wrapper.get(".progress").text()).toBe("0%");
  await wrapper.get("#input-is-passenger").setValue(true);
  expect(wrapper.get(".progress").text()).toBe("25%");
  await wrapper.get(".button-next").trigger("click");
  expect(wrapper.get(".step").text()).toBe("Step 2");
});

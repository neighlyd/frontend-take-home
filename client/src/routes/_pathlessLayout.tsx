import { createFileRoute } from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_pathlessLayout")({
  component: LayoutComponent,
});

function LayoutComponent() {
  return (
    <div>
      <div>I'm a layout</div>
      <div>
        <Outlet />
      </div>
    </div>
  );
}

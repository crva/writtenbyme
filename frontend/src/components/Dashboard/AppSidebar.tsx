import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NewspaperIcon } from "lucide-react";
import { Link, useSearchParams } from "react-router";

// TODO: Fetch from api
const items = [
  {
    id: 0,
    title: "Lorem Ipsum",
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi eleifend purus quis magna hendrerit porta ut sed felis. Sed consectetur vehicula urna, at ullamcorper nibh fermentum nec. Praesent congue tincidunt est, id volutpat nunc. Duis dolor arcu, volutpat eget euismod a, consectetur vitae orci. Aliquam a neque nibh. Aliquam sit amet suscipit ipsum. Fusce sit amet mi turpis. Suspendisse potenti.

Nulla sed arcu ullamcorper, rutrum lectus vitae, rhoncus nisl. Aliquam consectetur nunc vel molestie aliquam. Ut efficitur porttitor mauris, non efficitur augue. Vivamus vulputate pharetra lectus vitae aliquam. Vivamus ac finibus metus, eget ultricies libero. Nullam varius blandit magna, nec blandit arcu facilisis eget. Duis vestibulum malesuada iaculis. Aenean sapien lectus, mollis sit amet urna quis, lacinia maximus tortor. Donec in tristique nibh, a viverra leo. Cras cursus nulla tempor, tincidunt odio at, pretium sem. Sed sagittis sed neque ut pretium. Phasellus non augue sed mi iaculis venenatis.

Phasellus molestie velit a leo sollicitudin ultrices. Proin condimentum dapibus ex vel rhoncus. Proin dictum ultrices ex, vitae euismod mi. Mauris vulputate quis lectus id aliquam. Vivamus placerat iaculis lectus id interdum. Mauris in erat finibus, rutrum erat ut, tincidunt libero. Nam convallis ultricies lacus, ac vulputate risus scelerisque sed. Curabitur bibendum libero a arcu sollicitudin, id porttitor elit efficitur. Mauris bibendum augue ut mauris molestie ultrices. Nullam sit amet quam at sapien ornare placerat nec non urna. Aliquam interdum nisi ut purus placerat feugiat. In gravida porta tortor, ut elementum sapien vestibulum suscipit. Curabitur bibendum, sem non tempus ultrices, ligula quam imperdiet ligula, a molestie mauris ex nec velit. Mauris convallis pharetra turpis a venenatis.`,
  },
  {
    id: 1,
    title: "Lorem Ipsum 2",
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi eleifend purus quis magna hendrerit porta ut sed felis. Sed consectetur vehicula urna, at ullamcorper nibh fermentum nec. Praesent congue tincidunt est, id volutpat nunc. Duis dolor arcu, volutpat eget euismod a, consectetur vitae orci. Aliquam a neque nibh. Aliquam sit amet suscipit ipsum. Fusce sit amet mi turpis. Suspendisse potenti.

Nulla sed arcu ullamcorper, rutrum lectus vitae, rhoncus nisl. Aliquam consectetur nunc vel molestie aliquam. Ut efficitur porttitor mauris, non efficitur augue. Vivamus vulputate pharetra lectus vitae aliquam. Vivamus ac finibus metus, eget ultricies libero. Nullam varius blandit magna, nec blandit arcu facilisis eget. Duis vestibulum malesuada iaculis. Aenean sapien lectus, mollis sit amet urna quis, lacinia maximus tortor. Donec in tristique nibh, a viverra leo. Cras cursus nulla tempor, tincidunt odio at, pretium sem. Sed sagittis sed neque ut pretium. Phasellus non augue sed mi iaculis venenatis.

Phasellus molestie velit a leo sollicitudin ultrices. Proin condimentum dapibus ex vel rhoncus. Proin dictum ultrices ex, vitae euismod mi. Mauris vulputate quis lectus id aliquam. Vivamus placerat iaculis lectus id interdum. Mauris in erat finibus, rutrum erat ut, tincidunt libero. Nam convallis ultricies lacus, ac vulputate risus scelerisque sed. Curabitur bibendum libero a arcu sollicitudin, id porttitor elit efficitur. Mauris bibendum augue ut mauris molestie ultrices. Nullam sit amet quam at sapien ornare placerat nec non urna. Aliquam interdum nisi ut purus placerat feugiat. In gravida porta tortor, ut elementum sapien vestibulum suscipit. Curabitur bibendum, sem non tempus ultrices, ligula quam imperdiet ligula, a molestie mauris ex nec velit. Mauris convallis pharetra turpis a venenatis.`,
  },
];

export default function AppSidebar() {
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link to="#">
                <span className="text-base font-semibold">writtenbyme</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Articles</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <div
                      className={`cursor-pointer ${
                        Number(searchParams.get("article")) === item.id
                          ? "bg-primary"
                          : null
                      }`}
                      onClick={() =>
                        setSearchParams({ article: String(item.id) })
                      }
                    >
                      <NewspaperIcon />
                      <span>{item.title}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}

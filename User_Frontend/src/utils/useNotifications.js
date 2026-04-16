import { ref, computed } from "vue";

const notifications = ref([
  {
    id: 1,
    type: "login",
    name: "Maria Santos",
    message: "Maria Santos successfully logged in to the attendance system.",
    time: "Just now",
    read: false
  },
  {
    id: 2,
    type: "checkout",
    name: "Jose Reyes",
    message: "Jose Reyes completed checkout at 6:00 PM.",
    time: "5 mins ago",
    read: false
  },
  {
    id: 3,
    type: "late",
    name: "Ana Cruz",
    message: "Ana Cruz arrived late (08:15 AM) for her shift.",
    time: "20 mins ago",
    read: false
  },
  {
    id: 4,
    type: "absent",
    name: "Carlos Lim",
    message: "Carlos Lim marked absent for today’s shift.",
    time: "1 hour ago",
    read: true
  },
  {
    id: 5,
    type: "login",
    name: "Janina Somera",
    message: "Janina Somera logged in at branch system dashboard.",
    time: "3 hours ago",
    read: true
  },
  {
    id: 6,
    type: "checkout",
    name: "Roven Santos",
    message: "Roven Santos completed shift and checked out.",
    time: "1 day ago",
    read: true
  },
]);

const unreadCount = computed(() =>
  notifications.value.filter(n => !n.read).length
);

/* MARK ACTIONS */
const markAsRead = (id) => {
  const n = notifications.value.find(n => n.id === id);
  if (n) n.read = true;
};

const markAsUnread = (id) => {
  const n = notifications.value.find(n => n.id === id);
  if (n) n.read = false;
};

const markAllRead = () => {
  notifications.value.forEach(n => (n.read = true));
};

const deleteNotif = (id) => {
  notifications.value = notifications.value.filter(n => n.id !== id);
};

export function useNotifications() {
  return {
    notifications,
    unreadCount,
    markAsRead,
    markAsUnread,
    markAllRead,
    deleteNotif
  };
}
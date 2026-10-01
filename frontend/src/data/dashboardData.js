import {
  Activity,
  Target,
  BarChart3,
  DollarSign,
} from "lucide-react";

export const stats = [
  {
    title: "Win Rate",
    value: "68.42%",
    icon: Activity,
    color: "bg-green-600",
    change: "+2.3%",
  },
  {
    title: "Accuracy",
    value: "68.42%",
    icon: Target,
    color: "bg-blue-600",
    change: "+1.4%",
  },
  {
    title: "Trades",
    value: "245",
    icon: BarChart3,
    color: "bg-purple-600",
    change: "+18",
  },
  {
    title: "Profit Factor",
    value: "2.34",
    icon: DollarSign,
    color: "bg-orange-500",
    change: "+0.12",
  },
];
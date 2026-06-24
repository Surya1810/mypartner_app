export function useAuth() {
  const user = useState<null>("auth-user", () => null);
  return { user };
}

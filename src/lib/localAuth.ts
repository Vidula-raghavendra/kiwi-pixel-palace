interface LocalUser {
  id: string;
  email: string;
  password: string;
  created_at: string;
}

const USERS_KEY = 'kiwi_local_users';
const SESSION_KEY = 'kiwi_local_session';

export const localAuth = {
  signUp: async (email: string, password: string): Promise<{ user: any; error: any }> => {
    try {
      const users = getUsers();

      if (users.find(u => u.email === email)) {
        return { user: null, error: { message: 'User already exists' } };
      }

      const newUser: LocalUser = {
        id: crypto.randomUUID(),
        email,
        password,
        created_at: new Date().toISOString()
      };

      users.push(newUser);
      localStorage.setItem(USERS_KEY, JSON.stringify(users));

      return {
        user: { id: newUser.id, email: newUser.email },
        error: null
      };
    } catch (error: any) {
      return { user: null, error: { message: error.message } };
    }
  },

  signIn: async (email: string, password: string): Promise<{ user: any; session: any; error: any }> => {
    try {
      const users = getUsers();
      const user = users.find(u => u.email === email && u.password === password);

      if (!user) {
        return { user: null, session: null, error: { message: 'Invalid email or password' } };
      }

      const session = {
        user: { id: user.id, email: user.email },
        access_token: 'local-token-' + user.id,
        expires_at: Date.now() + 86400000
      };

      localStorage.setItem(SESSION_KEY, JSON.stringify(session));

      return { user: session.user, session, error: null };
    } catch (error: any) {
      return { user: null, session: null, error: { message: error.message } };
    }
  },

  signOut: async (): Promise<{ error: any }> => {
    localStorage.removeItem(SESSION_KEY);
    return { error: null };
  },

  getSession: async (): Promise<{ data: { session: any | null } }> => {
    const sessionStr = localStorage.getItem(SESSION_KEY);
    if (!sessionStr) {
      return { data: { session: null } };
    }

    try {
      const session = JSON.parse(sessionStr);
      if (session.expires_at < Date.now()) {
        localStorage.removeItem(SESSION_KEY);
        return { data: { session: null } };
      }
      return { data: { session } };
    } catch {
      return { data: { session: null } };
    }
  }
};

function getUsers(): LocalUser[] {
  const usersStr = localStorage.getItem(USERS_KEY);
  return usersStr ? JSON.parse(usersStr) : [];
}

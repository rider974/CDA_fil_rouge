import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    // Redirige vers la page de connexion si l'utilisateur n'est pas authentifié
    return {
      redirect: {
        destination: '/authentification/signin',
        permanent: false,
      },
    };
  } else {
    // Redirige vers la page appropriée en fonction du rôle de l'utilisateur
    if (session.user.role === 'admin') {
      return {
        redirect: {
          destination: '/dashboard/admin',
          permanent: false,
        },
      };
    } else if (session.user.role === 'member') {
      return {
        redirect: {
          destination: '/dashboard/member',
          permanent: false,
        },
      };
    } else if (session.user.role === 'moderator') {
      return {
        redirect: {
          destination: '/dashboard/moderator',
          permanent: false,
        },
      };
    } else {
      return {
        redirect: {
          destination: '/dashboard',
          permanent: false,
        },
      };
    }
  }
};

export default function HomePage() {
  return null; // Cette page ne s'affiche jamais car elle redirige toujours
}
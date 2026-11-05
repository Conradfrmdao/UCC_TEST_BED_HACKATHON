import AdminDashboard from '../../../components/admin/AdminDashboard';
export default async function AdminPage({ params }) { const value = await params; return <AdminDashboard section={value.section?.[0] || 'overview'} />; }

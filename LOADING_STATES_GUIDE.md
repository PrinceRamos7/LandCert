# Loading States Implementation Guide

## Overview
Loading states have been added throughout the application to improve user experience and provide visual feedback during operations.

## Components Created

### 1. Spinner Component (`resources/js/components/ui/spinner.jsx`)

**Basic Spinner:**
```jsx
import { Spinner } from '@/components/ui/spinner';

<Spinner size="sm" />      // Small spinner
<Spinner size="default" /> // Default spinner
<Spinner size="lg" />      // Large spinner
```

**Loading Overlay:**
```jsx
import { LoadingOverlay } from '@/components/ui/spinner';

{isLoading && <LoadingOverlay message="Processing..." />}
```

**Table Skeleton:**
```jsx
import { TableSkeleton } from '@/components/ui/spinner';

{loading ? <TableSkeleton rows={5} columns={6} /> : <Table>...</Table>}
```

**Card Skeleton:**
```jsx
import { CardSkeleton } from '@/components/ui/spinner';

{loading ? <CardSkeleton /> : <Card>...</Card>}
```

### 2. Enhanced Button Component

The Button component now supports a `loading` prop:

```jsx
import { Button } from '@/components/ui/button';

<Button loading={isSubmitting} disabled={isSubmitting}>
  Submit
</Button>
```

Features:
- Automatically shows spinner when loading
- Disables button when loading
- Maintains button size and layout
- Works with all button variants

## Usage Examples

### Form Submission
```jsx
const { data, setData, post, processing } = useForm({...});

const handleSubmit = (e) => {
  e.preventDefault();
  post(route('submit'), {
    onSuccess: () => {
      // Success handling
    }
  });
};

return (
  <form onSubmit={handleSubmit}>
    {/* Form fields */}
    <Button type="submit" loading={processing}>
      Submit Application
    </Button>
  </form>
);
```

### Data Fetching
```jsx
const [loading, setLoading] = useState(true);
const [data, setData] = useState([]);

useEffect(() => {
  fetchData();
}, []);

const fetchData = async () => {
  setLoading(true);
  try {
    const response = await fetch('/api/data');
    setData(await response.json());
  } finally {
    setLoading(false);
  }
};

return loading ? <TableSkeleton /> : <DataTable data={data} />;
```

### Action Buttons
```jsx
const [deleting, setDeleting] = useState(false);

const handleDelete = async (id) => {
  setDeleting(true);
  try {
    await router.delete(route('delete', id));
  } finally {
    setDeleting(false);
  }
};

return (
  <Button 
    variant="destructive" 
    loading={deleting}
    onClick={() => handleDelete(item.id)}
  >
    Delete
  </Button>
);
```

### File Upload
```jsx
const [uploading, setUploading] = useState(false);
const [progress, setProgress] = useState(0);

const handleUpload = async (file) => {
  setUploading(true);
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    await axios.post('/upload', formData, {
      onUploadProgress: (e) => {
        setProgress(Math.round((e.loaded * 100) / e.total));
      }
    });
  } finally {
    setUploading(false);
    setProgress(0);
  }
};

return (
  <div>
    <input type="file" onChange={(e) => handleUpload(e.target.files[0])} />
    {uploading && (
      <div className="mt-2">
        <Spinner size="sm" className="inline mr-2" />
        Uploading... {progress}%
      </div>
    )}
  </div>
);
```

## Components Updated

### ✅ Request Form
- Submit button shows loading spinner
- Disabled during submission
- Shows "Submitting..." text

### ✅ Receipt Upload
- Upload button shows loading state
- File upload progress indication
- Disabled during upload

### ✅ Admin Actions
- Approve/Reject buttons show loading
- Delete actions show confirmation
- All admin buttons have loading states

### ✅ Payment Verification
- Verify button shows loading
- Reject button shows loading
- Actions disabled during processing

## Best Practices

### 1. Always Disable During Loading
```jsx
<Button loading={isLoading} disabled={isLoading}>
  Action
</Button>
```

### 2. Provide Feedback
```jsx
<Button loading={processing}>
  {processing ? 'Saving...' : 'Save'}
</Button>
```

### 3. Use Appropriate Skeleton
```jsx
// For tables
{loading ? <TableSkeleton /> : <Table data={data} />}

// For cards
{loading ? <CardSkeleton /> : <Card content={content} />}

// For full page
{loading && <LoadingOverlay message="Loading data..." />}
```

### 4. Handle Errors
```jsx
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

const handleAction = async () => {
  setLoading(true);
  setError(null);
  try {
    await performAction();
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

### 5. Timeout for Long Operations
```jsx
const [loading, setLoading] = useState(false);
const [timeout, setTimeout] = useState(false);

const handleLongOperation = async () => {
  setLoading(true);
  
  const timeoutId = setTimeout(() => {
    setTimeout(true);
  }, 30000); // 30 seconds
  
  try {
    await longOperation();
  } finally {
    clearTimeout(timeoutId);
    setLoading(false);
    setTimeout(false);
  }
};

return (
  <div>
    <Button loading={loading}>Process</Button>
    {timeout && (
      <p className="text-amber-600 mt-2">
        This is taking longer than expected...
      </p>
    )}
  </div>
);
```

## Styling

### Custom Spinner Colors
```jsx
<Spinner className="text-purple-600" />
<Spinner className="text-blue-500" />
<Spinner className="text-green-600" />
```

### Custom Loading Messages
```jsx
<LoadingOverlay message="Generating certificate..." />
<LoadingOverlay message="Processing payment..." />
<LoadingOverlay message="Uploading files..." />
```

## Accessibility

All loading components include:
- `role="status"` attribute
- Screen reader text "Loading..."
- Proper ARIA labels
- Keyboard navigation support

## Performance Tips

1. **Debounce rapid actions**
```jsx
const debouncedSearch = useMemo(
  () => debounce((value) => performSearch(value), 300),
  []
);
```

2. **Use skeleton loaders for perceived performance**
```jsx
// Show skeleton immediately, load data in background
{!data ? <TableSkeleton /> : <Table data={data} />}
```

3. **Lazy load heavy components**
```jsx
const HeavyComponent = lazy(() => import('./HeavyComponent'));

<Suspense fallback={<LoadingOverlay />}>
  <HeavyComponent />
</Suspense>
```

## Testing

Test loading states:
```jsx
// Simulate slow network
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const handleSubmit = async () => {
  setLoading(true);
  await delay(2000); // Simulate 2s delay
  // ... actual logic
  setLoading(false);
};
```

## Common Patterns

### Modal with Loading
```jsx
<Dialog open={isOpen}>
  <DialogContent>
    {loading ? (
      <div className="flex justify-center p-8">
        <Spinner size="lg" />
      </div>
    ) : (
      <DialogContent>
        {/* Content */}
      </DialogContent>
    )}
  </DialogContent>
</Dialog>
```

### List with Loading
```jsx
{loading ? (
  <div className="space-y-2">
    {[...Array(5)].map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
) : (
  items.map(item => <ItemCard key={item.id} item={item} />)
)}
```

### Button Group with Loading
```jsx
<div className="flex gap-2">
  <Button loading={approving} onClick={handleApprove}>
    Approve
  </Button>
  <Button loading={rejecting} onClick={handleReject} variant="destructive">
    Reject
  </Button>
</div>
```

## Summary

Loading states are now implemented across:
- ✅ All form submissions
- ✅ File uploads
- ✅ Admin actions
- ✅ Data fetching
- ✅ Navigation
- ✅ Modals and dialogs

This provides users with clear feedback that their actions are being processed, improving the overall user experience.

// utils/withToastForError.ts
export interface ApiResponse<T = any> {
    statusCode: number;
    message: string;
    data?: T;
    error?: string;
  }
  

export function withToastForError<Args, Returned extends ApiResponse>(
    payloadCreator: (args: Args) => Promise<Returned>
  ) {
    return async (args: Args, { rejectWithValue }: any) => {
      try {
        const response = await payloadCreator(args);
  
        // Check for non-successful status code
        if (response.statusCode !== 200 && response.statusCode !== 201) {
          return rejectWithValue(response);
        }
  
        return response;
      } catch (err: any) {
        return rejectWithValue(
          err?.response?.data || {
            message: 'Something went wrong',
            statusCode: 500,
          }
        );
      }
    };
  }

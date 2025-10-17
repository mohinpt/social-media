
import { IPost } from "@/models/post";

type FetchOptions = {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
    body?: any,
    headers?: Record<string, string>
}

class ApiClient {
    private async fetch<T>(
        endpoint: string,
        options: FetchOptions = {}
    ): Promise<T> {
        const { method = "GET", body, headers = {} } = options

        const defaultHeaders = {
            "Content-Type": "application/json",
            ...headers
        }

        const response = await fetch(`/api${endpoint}`, {
            method,
            headers: defaultHeaders,
            body: body ? JSON.stringify(body) : undefined,

        })

        if (!response.ok) {
            throw new Error(await response.text())
        }

        return response.json();
    }
    
    async getPosts() {
        return this.fetch<IPost[]>("/posts");
    }

    async getSearchPosts(query: string) {
        // Encodes the query to be safe for URLs
        const encoded = encodeURIComponent(query.trim());
        return this.fetch<IPost[]>(`/posts/search?q=${encoded}`);
    }

    async createPost(postData: { content: string; username: string;  media?: { type: 'image' | 'video'; url: string } }) {
        return this.fetch("/posts", {
            method: "POST",
            body: postData,
        });
    }

    async updatePost(id: string, content: string) {
        return this.fetch(`/posts/${id}`, {
            method: "PUT",
            body: { id, content }
        })
    }

    async deletePost(id: string){
        return this.fetch(`/posts/${id}`, {
            method: "DELETE",
        })
    }
}

export const apiClient = new ApiClient();
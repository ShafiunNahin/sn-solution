<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\SystemSetting;
use Illuminate\Http\Request;

class SystemSettingController extends Controller
{
    public function index()
    {
        try {
            $setting = SystemSetting::latest('id')->first();

            if (!$setting) {
                return response()->json([
                    'message' => 'No settings found'
                ], 404);
            }

            return response()->json(['data' => $setting]);
        } catch (\Exception $e) {
            logger()->error('SystemSettingController@index DB error: ' . $e->getMessage());
            return response()->json(['message' => 'Database unavailable', 'error' => $e->getMessage()], 503);
        }
    }

    public function getInfo()
    {
        try {
            $setting = SystemSetting::latest('id')->first();
            
            return response()->json([
                'app_name' => $setting->app_name ?? 'App',
                'logo' => $setting->logo,
                'favicon' => $setting->favicon
            ]);
        } catch (\Exception $e) {
            logger()->error('SystemSettingController@getInfo error: ' . $e->getMessage());
            return response()->json([
                'app_name' => 'App',
                'logo' => null,
                'favicon' => null
            ]);
        }
    }

    public function store(Request $request)
    {
        $request->validate([
            'support_email' => 'required|email|unique:system_settings,support_email',
            'password' => 'required|min:6',
        ]);

        $setting = SystemSetting::create($request->all());

        return response()->json(['data' => $setting], 201);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'support_email' => 'required|email|unique:system_settings,support_email,' . $id,
            'password' => 'nullable|min:6',
        ]);

        $setting = SystemSetting::findOrFail($id);
        $data = $request->except('password');

        if ($request->filled('password')) {
            $data['password'] = $request->password;
        }

        $setting->update($data);

        return response()->json(['data' => $setting]);
    }

    public function destroy($id)
    {
        SystemSetting::destroy($id);
        return response()->json(['message' => 'Deleted']);
    }

    public function uploadFile(Request $request)
    {
        $request->validate([
            'file' => 'required|image|max:5120',
            'type' => 'required|in:logo,favicon'
        ]);

        try {
            $file = $request->file('file');
            $type = $request->input('type');
            $dir = 'uploads/' . $type . 's';
            
            if (!file_exists(public_path($dir))) {
                mkdir(public_path($dir), 0755, true);
            }

            $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path($dir), $filename);
            $url = '/' . $dir . '/' . $filename;

            return response()->json([
                'message' => 'File uploaded successfully',
                'url' => $url,
                'filename' => $filename
            ]);
        } catch (\Exception $e) {
            logger()->error('File upload error: ' . $e->getMessage());
            return response()->json(['message' => 'Upload failed'], 500);
        }
    }
}

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TppOrgService } from './tpp-org.service';
import { TppOrg } from '../models/tpp-org.model';
import { environment } from '../../environments/environment';

describe('TppOrgService', () => {
  let service: TppOrgService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/tpp-orgs`;

  const mockTppOrg: TppOrg = {
    tppOrgId: '1',
    tpp: { tppId: '1', tppName: 'Test TPP', tppDesc: 'Test Description' } as any,
    org: { orgId: '1', name: 'Test Org' } as any,
    status: 'active',
    createdDate: new Date(),
    updatedDate: new Date(),
    createdBy: 'test',
    updatedBy: 'test'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TppOrgService]
    });
    service = TestBed.inject(TppOrgService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all TppOrgs', () => {
    const mockTppOrgs = [mockTppOrg];

    service.getTppOrgs().subscribe(tppOrgs => {
      expect(tppOrgs).toEqual(mockTppOrgs);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockTppOrgs);
  });

  it('should get a single TppOrg', () => {
    service.getTppOrg(mockTppOrg.tppOrgId).subscribe(tppOrg => {
      expect(tppOrg).toEqual(mockTppOrg);
    });

    const req = httpMock.expectOne(`${apiUrl}/${mockTppOrg.tppOrgId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTppOrg);
  });

  it('should create a TppOrg', () => {
    service.createTppOrg(mockTppOrg).subscribe(tppOrg => {
      expect(tppOrg).toEqual(mockTppOrg);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.createdDate).toBeTruthy();
    expect(req.request.body.updatedDate).toBeTruthy();
    req.flush(mockTppOrg);
  });

  it('should update a TppOrg', () => {
    service.updateTppOrg(mockTppOrg).subscribe(tppOrg => {
      expect(tppOrg).toEqual(mockTppOrg);
    });

    const req = httpMock.expectOne(`${apiUrl}/${mockTppOrg.tppOrgId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body.updatedDate).toBeTruthy();
    req.flush(mockTppOrg);
  });

  it('should delete a TppOrg', () => {
    service.deleteTppOrg(mockTppOrg.tppOrgId).subscribe(response => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne(`${apiUrl}/${mockTppOrg.tppOrgId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
}); 
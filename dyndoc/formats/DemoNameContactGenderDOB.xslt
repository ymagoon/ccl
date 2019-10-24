<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="7.0"?>
<xsl:stylesheet version="2.0" 
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:xs="http://www.w3.org/2001/XMLSchema" 
	xmlns:fn="http://www.w3.org/2005/xpath-functions"
	xmlns:xr-date-formatter="java:com.cerner.xsl.util.XSLTDateUtilities"
	xmlns:n="urn:com-cerner-patient-ehr:v3"
	xmlns:cdocfx="urn:com-cerner-physician-documentation-functions"
	xmlns:extfx="urn:com-cerner-physician-documentation-extension-functions"
	xmlns:doc="java:com.cerner.documentation.extension.XSLTFuncs"
	xmlns:dd="DynamicDocumentation"
	xmlns:java-string="java:java.lang.String"
	exclude-result-prefixes="xsl xs fn n cdocfx xr-date-formatter extfx doc dd java-string">

	<xsl:output method="html" encoding="UTF-8" indent="yes"/>
	
	<xsl:param as="xs:string" name="current-locale" select="'en_US'"/>
	
	<!-- required to include CommonFxn.xslt -->
	<!-- Comment this line to debug --> <xsl:include href="/cernerbasiccontent/formats/commonfxn.xslt" />
	<!-- Uncomment this line to debug <xsl:include href="commonfxn.xslt" /> -->
	
	<!-- Default string constants -->
	<xsl:variable name="Name" as="xs:string">
		<xsl:value-of select="'Name:'"/>
	</xsl:variable>
	
	<xsl:variable name="Address" as="xs:string">
		<xsl:value-of select="'Address:'"/>
	</xsl:variable>
	
	<xsl:variable name="Sex" as="xs:string">
		<xsl:value-of select="'Sex:'"/>
	</xsl:variable>
	
	<xsl:variable name="DOB" as="xs:string">
		<xsl:value-of select="'Date of Birth:'"/>
	</xsl:variable>
	
	<xsl:variable name="Phone" as="xs:string">
		<xsl:value-of select="'Phone:'"/>
	</xsl:variable>
	
	<xsl:variable name="EmergencyContact" as="xs:string">
		<xsl:value-of select="'Emergency Contact:'"/>
	</xsl:variable>
	
	<xsl:variable name="DATE_ONLY_SEQUENCE" as="xs:string" select="'MM/dd/yyyy'"/>
	
	<!-- Keys -->
	<xsl:key name="keyCode" match="n:report/n:code-list/n:code" use="@code"/>
	
	<xsl:template match="/">
		
		<xsl:if test="n:report/n:demographics/n:patient-info">
			
			<div class="ddemrcontentitem ddremovable" dd:btnfloatingstyle="top-right">
				<xsl:attribute name="dd:entityid">
					<xsl:if test="n:report/n:clinical-data/n:encounter-data/n:encounter/@encounter-id">
						<xsl:value-of select="n:report/n:clinical-data/n:encounter-data/n:encounter/@encounter-id"/>
					</xsl:if>	
				</xsl:attribute>
				<xsl:attribute name="dd:contenttype">
					<xsl:text>ENCNTRINFO</xsl:text>
				</xsl:attribute>
				
				<xsl:if test="n:report/n:demographics/n:patient-info/n:patient-name/@name-full">
					<div class="ddgrouper ddremovable" dd:btnfloatingstyle="top-right">	
						<xsl:value-of select="$Name"/>
						<span style="margin-left:1ex;"><xsl:value-of select="n:report/n:demographics/n:patient-info/n:patient-name/@name-full"/></span>
					</div>
				</xsl:if>
				<xsl:if test="n:report/n:demographics/n:patient-info/n:home-address">
					<div style="clear:both; overflow:hidden;" class="ddgrouper ddremovable" dd:btnfloatingstyle="top-right">	
						<div style="float:left;">
							<xsl:value-of select="$Address"/>
						</div>
						<div style="float:left; margin-left:1ex;">
							<xsl:call-template name="DisplayAddress">
								<xsl:with-param name="Address" select="n:report/n:demographics/n:patient-info/n:home-address"/>
							</xsl:call-template>
						</div>
					</div>	
				</xsl:if>
				<xsl:if test="n:report/n:demographics/n:patient-info/@sex-code">
					<xsl:if test="key('keyCode', n:report/n:demographics/n:patient-info/@sex-code)/@display">
						<div class="ddgrouper ddremovable" dd:btnfloatingstyle="top-right">	
							<xsl:value-of select="$Sex"/>
							<span style="margin-left:1ex;"><xsl:value-of select="key('keyCode', n:report/n:demographics/n:patient-info/@sex-code)/@display"/></span>
						</div>	
					</xsl:if>
				</xsl:if>
				<xsl:if test="n:report/n:demographics/n:patient-info/n:birth-dt-tm/n:date">
					<div class="ddgrouper ddremovable" dd:btnfloatingstyle="top-right">	
						<xsl:value-of select="$DOB"/>
						<xsl:variable name="DateTime" as="xs:dateTime" select="n:report/n:demographics/n:patient-info/n:birth-dt-tm/n:date"/>
						<xsl:variable name="TimeZone" as="xs:string" select="n:report/n:demographics/n:patient-info/n:birth-dt-tm/n:date/@time-zone"/>
						<span style="margin-left:1ex;"><xsl:value-of select="xr-date-formatter:formatDate($DateTime, $DATE_ONLY_SEQUENCE, $TimeZone, $current-locale)"/></span>
					</div>	
				</xsl:if>
				<xsl:if test="n:report/n:demographics/n:patient-info/@home-phone">	
					<div class="ddgrouper ddremovable" dd:btnfloatingstyle="top-right">	
						<xsl:value-of select="$Phone"/>
						<span style="margin-left:1ex;"><xsl:value-of select="n:report/n:demographics/n:patient-info/@home-phone"/></span>
					</div>	
				</xsl:if>
				<xsl:if test="n:report/n:demographics/n:patient-info/@emergency-contact">
					<div class="ddgrouper ddremovable" dd:btnfloatingstyle="top-right">	
						<xsl:value-of select="$EmergencyContact"/>
						<span style="margin-left:1ex;"><xsl:value-of select="n:report/n:demographics/n:patient-info/@emergency-contact"/></span>
					</div>	
				</xsl:if>
			</div>
			
		</xsl:if>
		
	</xsl:template>
	
	<xsl:template name="DisplayAddress">
		<xsl:param name = "Address"/>
				
		<xsl:variable name="Address1" as="xs:string">
			<xsl:choose>
				<xsl:when test="$Address/@address1">
					<xsl:value-of select="$Address/@address1"/>
				</xsl:when>
				<xsl:otherwise>
					<xsl:value-of select="''"/>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		
		<xsl:variable name="Address2" as="xs:string">
			<xsl:choose>
				<xsl:when test="$Address/@address2">
					<xsl:value-of select="$Address/@address2"/>
				</xsl:when>
				<xsl:otherwise>
					<xsl:value-of select="''"/>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		
		<xsl:variable name="Address3" as="xs:string">
			<xsl:choose>
				<xsl:when test="$Address/@address3">
					<xsl:value-of select="$Address/@address3"/>
				</xsl:when>
				<xsl:otherwise>
					<xsl:value-of select="''"/>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		
		<xsl:variable name="Address4" as="xs:string">
			<xsl:choose>
				<xsl:when test="$Address/@address4">
					<xsl:value-of select="$Address/@address4"/>
				</xsl:when>
				<xsl:otherwise>
					<xsl:value-of select="''"/>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		
		<xsl:variable name="City" as="xs:string">
			<xsl:choose>
				<xsl:when test="$Address/@city">
					<xsl:value-of select="$Address/@city"/>
				</xsl:when>
				<xsl:otherwise>
					<xsl:value-of select="''"/>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>

		<xsl:variable name="State" as="xs:string">
			<xsl:choose>
				<xsl:when test="$Address/@state">
					<xsl:value-of select="$Address/@state"/>
				</xsl:when>
				<xsl:otherwise>
					<xsl:value-of select="''"/>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>

		<xsl:variable name="Zip" as="xs:string">
			<xsl:choose>
				<xsl:when test="$Address/@zip">
					<xsl:value-of select="$Address/@zip"/>
				</xsl:when>
				<xsl:otherwise>
					<xsl:value-of select="''"/>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>

		<xsl:if test="$Address1!=''"> 
			<xsl:value-of select="$Address1"/>
		</xsl:if>
		
		<xsl:if test="$Address2!=''"> 
			<xsl:if test="$Address1!=''"> 
				<br />
			</xsl:if>
			<xsl:value-of select="$Address2"/>
		</xsl:if>
		
		<xsl:if test="$Address3!=''"> 
			<xsl:if test="$Address1!='' or $Address2!=''"> 
				<br />
			</xsl:if>
			<xsl:value-of select="$Address3"/>
		</xsl:if>
		
		<xsl:if test="$Address4!=''"> 
			<xsl:if test="$Address1!='' or $Address2!='' or $Address3!=''"> 
				<br />
			</xsl:if>
			<xsl:value-of select="$Address4"/>
		</xsl:if>
		
		<xsl:if test="$City!='' or $State!='' or $Zip!=''">
			<br />
			
			<xsl:if test="$City!=''"> 
				<xsl:value-of select="$City"/>
			</xsl:if>
			<xsl:if test="$State!=''">
				<xsl:if test="$City!=''">
					<xsl:value-of select="', '"/>
				</xsl:if>
				<xsl:value-of select="$State"/>
			</xsl:if>
			<xsl:if test="$Zip!=''">
				<xsl:if test="$City!='' or $State!=''">
					<xsl:value-of select="' '"/>
				</xsl:if>
				<xsl:value-of select="$Zip"/>
			</xsl:if>
			
		</xsl:if>
		
	</xsl:template>
	
</xsl:stylesheet>